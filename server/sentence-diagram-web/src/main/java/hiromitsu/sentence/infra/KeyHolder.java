package hiromitsu.sentence.infra;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * JSON Web Tokenを生成・保持するクラス.
 * このインスタンスの生成時、Redisからキーペアの取得を試み、存在していればその値を利用することでアプリケーションよりも長い期間、キーペアを保持する.
 */
@ApplicationScoped
public class KeyHolder {

  private static Logger logger = LoggerFactory.getLogger(KeyHolder.class);

  @Inject
  private RedisConnector redisConnector;

  private KeyPair keyPair;

  @PostConstruct
  public void postConstruct() {
    String value = redisConnector.get("keyPair");
    if (value != null && !value.isEmpty()) {
      deserializeKeyPair(value);
    } else {
      this.keyPair = Keys.keyPairFor(SignatureAlgorithm.RS512);
      redisConnector.set("keyPair", serializeKeyPair());
    }
  }

  public KeyPair getKeyPair() {
    return keyPair;
  }

  public String serializeKeyPair() {
    ByteArrayOutputStream baos = new ByteArrayOutputStream(1024);
    try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
      oos.writeObject(keyPair);
      oos.flush();
    } catch (IOException e) {
      logger.error("serialization error", e);
    }

    byte[] bytes = baos.toByteArray();
    return new String(bytes, StandardCharsets.ISO_8859_1);
  }

  public void deserializeKeyPair(String str) {
    byte[] bytes = str.getBytes(StandardCharsets.ISO_8859_1);
    try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
      Object o = ois.readObject();
      if (o instanceof KeyPair) {
        this.keyPair = (KeyPair) o;
      } else {
        logger.error("deserialization error: {}", o.getClass().getCanonicalName());
      }
    } catch (IOException | ClassNotFoundException e) {
      logger.error("deserialization error", e);
    }
  }
}
