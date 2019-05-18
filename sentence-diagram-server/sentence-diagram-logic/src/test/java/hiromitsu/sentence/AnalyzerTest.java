package hiromitsu.sentence;

import java.util.List;

import org.junit.jupiter.api.Test;

class AnalyzerTest {

  @Test
  void subjectAndVerb1() {
    String text = "Bill is running.";
    List<ParsedResult> results = Analyzer.analyze(text);
    printResult(results);
  }
  
  @Test
  void subjectAndVerb2() {
    String text = "Bill was watched.";
    List<ParsedResult> results = Analyzer.analyze(text);
    printResult(results);
  }
  
  private void printResult(List<ParsedResult> results) {
    results.forEach(r -> {
      System.out.println(r.toPrettyJSON());
      System.out.println(r.toGraphPrettyString()); 
    });
  }
}
