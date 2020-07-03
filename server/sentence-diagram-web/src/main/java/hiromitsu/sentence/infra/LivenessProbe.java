package hiromitsu.sentence.infra;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

@Liveness
@ApplicationScoped
public class LivenessProbe implements HealthCheck {

  @Override
  public HealthCheckResponse call() {
    return HealthCheckResponse.up("success");
  }

}
