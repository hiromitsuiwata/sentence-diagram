package hiromitsu.sentence.infra;

import java.security.KeyPair;

import javax.enterprise.context.ApplicationScoped;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;

@ApplicationScoped
public class KeyHolder {

  @Getter
  private KeyPair keyPair = Keys.keyPairFor(SignatureAlgorithm.RS512);
}
