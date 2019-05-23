package hiromitsu.sentence;

import java.util.List;

import hiromitsu.sentence.grouping.GroupingAdvmod;
import hiromitsu.sentence.grouping.GroupingAuxAndAuxpass;
import hiromitsu.sentence.grouping.GroupingCase;
import hiromitsu.sentence.grouping.GroupingNmodPoss;
import hiromitsu.sentence.grouping.GroupingNsubjAndNsubjpass;

/**
 * dependency分析
 */
public class Analyzer {

  private Analyzer() { 
  }
  
  /**
   * dependencyを読み取ってグラフ構造のデータを追加する
   * @param text
   * @return
   */
  public static List<ParsedResult> analyze(String text) {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    List<ParsedResult> results = wrapper.parse(text);
    
    for (ParsedResult r : results) {
      // FIXME とりあえず
      GroupingCase.execute(r);
      GroupingNmodPoss.execute(r);
      GroupingAuxAndAuxpass.execute(r);
      GroupingAdvmod.execute(r);
      GroupingNsubjAndNsubjpass.execute(r);
    }
    
    return results;
  }
}
