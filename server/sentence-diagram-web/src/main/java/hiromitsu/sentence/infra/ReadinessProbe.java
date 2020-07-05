package hiromitsu.sentence.infra;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Readiness probe用のエンドポイント.DBへ接続できているときにupを返す.
 */
@Readiness
@ApplicationScoped
public class ReadinessProbe implements HealthCheck {

  private static Logger logger = LoggerFactory.getLogger(ReadinessProbe.class);

  @PersistenceContext
  private EntityManager em;

  @Override
  public HealthCheckResponse call() {

    try {
      if (em == null) {
        logger.error("entity manager is null");
        return HealthCheckResponse.down("fail. entity manager is null");
      }
      Query q = em.createNativeQuery("select 1");
      q.getSingleResult();
    } catch (RuntimeException e) {
      logger.error("database connection error", e);
      return HealthCheckResponse.down("fail. database connection error");
    }

    return HealthCheckResponse.up("success");
  }

}
