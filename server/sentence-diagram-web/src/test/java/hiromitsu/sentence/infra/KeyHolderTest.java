package hiromitsu.sentence.infra;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.security.KeyPair;

import org.junit.jupiter.api.Test;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class KeyHolderTest {

  @Test
  public void testSerializeDeserialize() {
    KeyHolder k = new KeyHolder();
    KeyPair originalPair = k.createKeyPair();

    String serial = k.serializeKeyPair(originalPair);

    KeyPair restoredPair = k.deserializeKeyPair(serial);

    assertEquals(originalPair.getPrivate(), restoredPair.getPrivate());
    assertEquals(originalPair.getPublic(), restoredPair.getPublic());
  }

  @Test
  public void testPostConstruct() {
    // KeyHolder k = new KeyHolder();
    // RedisConnector r = new RedisConnector();
    // JedisPool pool = new JedisPool(new JedisPoolConfig(), "localhost");
    // r.setPool(pool);

    // k.setRedisConnector(r);
    // k.postConstruct();
  }
}
