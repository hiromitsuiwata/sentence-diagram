package hiromitsu.sentence;

import java.util.List;

import hiromitsu.sentence.rule.AdvmodNmodTmodNeg;
import hiromitsu.sentence.rule.AuxAndAuxpass;
import hiromitsu.sentence.rule.Case;
import hiromitsu.sentence.rule.DetAndAmod;
import hiromitsu.sentence.rule.NmodPoss;
import hiromitsu.sentence.rule.NsubjAndNsubjpass;

/**
 * dependency分析
 */
public class Analyzer {

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
      // FIXME とりあえず
      Case.execute(r);
      NmodPoss.execute(r);
      AuxAndAuxpass.execute(r);
      AdvmodNmodTmodNeg.execute(r);
      DetAndAmod.execute(r);
      NsubjAndNsubjpass.execute(r);
    }

    return results;
  }
}
