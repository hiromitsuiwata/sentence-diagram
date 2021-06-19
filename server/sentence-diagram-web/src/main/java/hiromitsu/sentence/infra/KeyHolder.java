package hiromitsu.sentence.infra;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.nio.charset.StandardCharsets;
import java.io.ObjectOutputStream;

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

  public void setRedisConnector(RedisConnector r) {
    this.redisConnector = r;
  }

  private KeyPair keyPair;

  @PostConstruct
  public void postConstruct() {
    String value = redisConnector.get("keyPair");
    if (value != null && !value.isEmpty()) {
      logger.info("Redisに登録済みのkeyPairを取得: 長さ: {}", value.length());
      logger.info("見つかったkeyPairを復元");
      KeyPair kp = deserializeKeyPair(value);
      this.keyPair = kp;
    } else {
      logger.info("Redisに登録済みkeyPairがないため新規作成したkeyPairをセット");
      KeyPair newKeyPair = Keys.keyPairFor(SignatureAlgorithm.RS512);
      String serializedKeyPair = serializeKeyPair(newKeyPair);
      logger.info("シリアライズしたkeyPair: 長さ: {}", serializedKeyPair.length());
      redisConnector.set("keyPair", serializedKeyPair);
      this.keyPair = newKeyPair;
    }
  }

  public KeyPair createKeyPair() {
    return Keys.keyPairFor(SignatureAlgorithm.RS512);
  }

  public String serializeKeyPair(KeyPair kp) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream(16384);
    try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
      oos.writeObject(kp);
      oos.flush();
    } catch (IOException e) {
      logger.error("serialization error", e);
    }

    byte[] bytes = baos.toByteArray();
    return new String(bytes, StandardCharsets.ISO_8859_1);
  }

  public KeyPair deserializeKeyPair(String str) {
    byte[] bytes = str.getBytes(StandardCharsets.ISO_8859_1);

    try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
      Object o = ois.readObject();
      if (o instanceof KeyPair) {
        return (KeyPair) o;
      } else {
        throw new IllegalArgumentException("deserialization error: object is not KeyPair");
      }
    } catch (IOException | ClassNotFoundException e) {
      throw new IllegalArgumentException("deserialization error", e);
    }
  }

  public KeyPair getKeyPair() {
    return keyPair;
  }
}
