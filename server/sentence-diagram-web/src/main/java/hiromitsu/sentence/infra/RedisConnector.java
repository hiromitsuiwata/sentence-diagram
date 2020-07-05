package hiromitsu.sentence.infra;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * Redisへの接続と値の保存、取得を行う
 */
@ApplicationScoped
public class RedisConnector {

  private JedisPool pool = new JedisPool(new JedisPoolConfig(), "localhost");

  @PreDestroy
  public void preDestroy() {
    pool.close();
  }

  public void set(String key, String value) {
    try (Jedis jedis = pool.getResource()) {
      jedis.set(key, value);
    }
  }

  public String get(String key) {
    try (Jedis jedis = pool.getResource()) {
      return jedis.get(key);
    }
  }
}
