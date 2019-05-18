package hiromitsu.sentence;

import java.util.List;

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
      // FIXME とりあえず2回実行する
      Grouping.groupAuxAndAuxpass(r);
      Grouping.groupNsubjAndNsubjpass(r);
    }
    
    return results;
  }
}
