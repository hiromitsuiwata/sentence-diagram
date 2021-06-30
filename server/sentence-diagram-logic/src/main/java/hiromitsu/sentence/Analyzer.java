package hiromitsu.sentence;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

  private static Logger logger = LoggerFactory.getLogger(Analyzer.class);

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
      if (logger.isInfoEnabled()) {
        logger.info(r.toDepString());
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
