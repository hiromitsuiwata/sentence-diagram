package hiromitsu.sentence;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

class AnalyzerTest {

  @Test
  void subjectAndVerb1() {
    String text = "Bill is running.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("is running--nsubj-->Bill", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }
  
  @Test
  void subjectAndVerb2() {
    String text = "Bill was watched.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("was watched--nsubj-->Bill", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }
  
  @Test
  void subjectAndVerb3() {
    String text = "Have you decided?";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("Have decided--nsubj-->you", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }

  @Test
  void subjectAndVerb4() {
    String text = "I may have been running.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("may have been running--nsubj-->I", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }
  

  private void printResult(List<ParsedResult> results) {
    results.forEach(r -> {
      System.out.println(r.toPrettyJSON());
      System.out.println(r.toGraphPrettyString()); 
    });
  }
}
