package hiromitsu.sentence;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import hiromitsu.sentence.rule.AdvmodNmodTmodNeg;
import hiromitsu.sentence.rule.AuxAndAuxpass;
import hiromitsu.sentence.rule.Case;
import hiromitsu.sentence.rule.DetAndAmod;
import hiromitsu.sentence.rule.Dobj;
import hiromitsu.sentence.rule.NmodPoss;
import hiromitsu.sentence.rule.NsubjAndNsubjpass;

/**
 * dependency分析
 */
public class Analyzer {

  private static final Logger LOGGER = LogManager.getLogger();

  private Analyzer() {
  }

  /**
   * dependencyを読み取ってグラフ構造のデータを追加する
   *
   * @param text
   * @return
   */
  public static List<ParsedResult> analyze(String text) {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    List<ParsedResult> results = wrapper.parse(text);

    for (ParsedResult r : results) {
      if (LOGGER.isInfoEnabled()) {
        LOGGER.info(r.toDepString());
      }

      Case.execute(r);
      NmodPoss.execute(r);
      AuxAndAuxpass.execute(r);
      AdvmodNmodTmodNeg.execute(r);
      DetAndAmod.execute(r);
      Dobj.execute(r);
      NsubjAndNsubjpass.execute(r);

    }

    return results;
  }
}
