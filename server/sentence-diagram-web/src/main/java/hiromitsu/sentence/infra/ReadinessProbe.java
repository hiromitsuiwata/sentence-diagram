package hiromitsu.sentence.infra;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Readiness probe用のエンドポイント.DBへ接続できているときにupを返す.
 */
@Readiness
@ApplicationScoped
public class ReadinessProbe implements HealthCheck {

  private static final Logger LOGGER = LogManager.getLogger();

  @PersistenceContext
  private EntityManager em;

  @Override
  public HealthCheckResponse call() {

    try {
      if (em == null) {
        LOGGER.error("entity manager is null");
        return HealthCheckResponse.down("fail. entity manager is null");
      }
      Query q = em.createNativeQuery("select 1");
      q.getSingleResult();
    } catch (RuntimeException e) {
      LOGGER.error("database connection error", e);
      return HealthCheckResponse.down("fail. database connection error");
    }

    return HealthCheckResponse.up("success");
  }

}
