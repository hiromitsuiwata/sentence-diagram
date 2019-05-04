package hiromitsu.sentence;

import java.util.List;

import org.junit.jupiter.api.Test;

class AnalyzerTest {

  @Test
  void testAnalyze() {
    String text = "Bill is calling.";
    List<ParsedResult> results = Analyzer.analyze(text);
//    results.forEach(r -> System.out.println(r.toPrettyJSON()));
//    results.forEach(r -> System.out.println(r.toWordTable()));
    results.forEach(r -> System.out.println(r.toGraphPrettyString()));
  }
}
