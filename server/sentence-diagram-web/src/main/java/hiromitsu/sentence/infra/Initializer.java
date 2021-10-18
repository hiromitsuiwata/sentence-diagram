package hiromitsu.sentence.infra;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * 初期化
 */
@WebListener
public class Initializer implements ServletContextListener {

  @Override
  public void contextInitialized(ServletContextEvent ev) {
    // no-op
  }

  @Override
  public void contextDestroyed(ServletContextEvent ev) {
    // no-op
  }
}
