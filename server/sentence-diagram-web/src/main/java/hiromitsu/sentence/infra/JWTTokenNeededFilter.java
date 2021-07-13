package hiromitsu.sentence.infra;

import java.io.IOException;
import java.security.Key;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

/**
 * JSON Web Tokenを付加したリクエストでない場合にアクセスを拒否するフィルター
 */
@Provider
@JWTTokenNeeded
@Priority(Priorities.AUTHENTICATION)
public class JWTTokenNeededFilter implements ContainerRequestFilter {

  private static Logger logger = LoggerFactory.getLogger(JWTTokenNeededFilter.class);

  @Inject
  private KeyHolder holder;

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {

    String token = null;
    try {
      Cookie cookie = requestContext.getCookies().get("jwt-token");
      token = cookie.getValue();
    } catch (NullPointerException e) {
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }

    try {
      // Validate the token
      Key key = holder.getKeyPair().getPublic();
      // https://github.com/jwtk/jjwt/pull/346
      Jws<Claims> claim = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      logger.info("valid token: {}", token);
      logger.info("claim header: {}, date: {}, body: {}, subject: {}", claim.getHeader().toString(),
          claim.getBody().getIssuedAt().toString(), claim.getBody(), claim.getBody().getSubject());

    } catch (Exception e) {
      logger.error("invalid token: {}", token);
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }
  }

}
