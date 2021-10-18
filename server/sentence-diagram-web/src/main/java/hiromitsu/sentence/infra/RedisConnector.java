package hiromitsu.sentence.infra;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * Redisへの接続と値の保存、取得を行う
 */
@ApplicationScoped
public class RedisConnector {

  private static final Logger LOGGER = LogManager.getLogger();

  private JedisPool pool;

  public void setPool(JedisPool p) {
    this.pool = p;
  }

  @PostConstruct
  public void postContruct() {
    String host = System.getProperty("REDIS_HOST");
    pool = new JedisPool(new JedisPoolConfig(), host);
  }

  @PreDestroy
  public void preDestroy() {
    pool.close();
  }

  public void set(String key, String value) {
    LOGGER.info("Redisに値を設定: key: {}, value: {}", key, value);
    try (Jedis jedis = pool.getResource()) {
      jedis.set(key, value);
    }
  }

  public String get(String key) {
    LOGGER.info("Redisから値を取得: key: {}", key);
    try (Jedis jedis = pool.getResource()) {
      return jedis.get(key);
    }
  }
}
