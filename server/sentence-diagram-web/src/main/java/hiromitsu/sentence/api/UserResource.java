package hiromitsu.sentence.api;

import java.security.Key;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hiromitsu.sentence.infra.KeyHolder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * 認証、ユーザー管理を行うリソース
 */
@Path("users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class UserResource {

  @Inject
  private KeyHolder holder;

  private static Logger logger = LoggerFactory.getLogger(UserResource.class);

  @POST
  @Path("login")
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  public Response authenticateUser(@FormParam("login") String login, @FormParam("password") String password) {
    try {
      authenticate(login, password);
      String token = issueToken(login);
      // TODO テスト時はSecure;をつけない
      String cookie = String.format("%s=%s; max-age=3600; Path=/; HttpOnly; SameSite=strict;", "jwt-token", token);
      return Response.ok().header("Set-Cookie", cookie).build();
    } catch (Exception e) {
      logger.error("authentication error", e);
      return Response.status(Status.UNAUTHORIZED).build();
    }
  }

  private void authenticate(String login, String password) {
    // TODO テスト用に必ず成功するようにしておく
  }

  private String issueToken(String login) {
    String uriInfo = "mysite";
    logger.info(holder.toString());
    logger.info(holder.getKeyPair().toString());
    Key key = holder.getKeyPair().getPrivate();
    return Jwts.builder().setSubject(login).setIssuer(uriInfo).setIssuedAt(new Date())
        .setExpiration(toDate(LocalDateTime.now().plusMinutes(15L))).signWith(key, SignatureAlgorithm.RS512).compact();
  }

  private Date toDate(LocalDateTime localDateTime) {
    ZoneId zone = ZoneId.systemDefault();
    ZonedDateTime zonedDateTime = ZonedDateTime.of(localDateTime, zone);
    Instant instant = zonedDateTime.toInstant();
    return Date.from(instant);
  }
}
