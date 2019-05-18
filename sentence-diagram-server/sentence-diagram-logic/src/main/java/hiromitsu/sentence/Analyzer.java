package hiromitsu.sentence;

import java.util.List;

public class Analyzer {

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
