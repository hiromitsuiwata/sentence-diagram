package hiromitsu.sentence;

import java.util.List;

public class Analyzer {

  public static List<ParsedResult> analyze(String text) {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    List<ParsedResult> results = wrapper.parse(text);
    
    for (ParsedResult r : results) {
      // 2回実行する
      Grouping.groupAux(r);
      Grouping.groupNsubj(r);
    }
    
    return results;
  }
}
