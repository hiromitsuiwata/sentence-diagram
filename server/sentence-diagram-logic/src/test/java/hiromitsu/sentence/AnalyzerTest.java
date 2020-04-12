package hiromitsu.sentence;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import hiromitsu.sentence.visualization.VResult;

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
  void auxAndAuxpass1() {
    String text = "Have you decided?";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("Have decided--nsubj-->you", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }

  @Test
  void auxAndAuxpass2() {
    String text = "I may have been running.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("may have been running--nsubj-->I", results.get(0).getEdgeList().get(0).toPrettyString());
    printResult(results);
  }

  @Test
  void nmodpossAndAdvmod1() {
    String text = "Where is Bill's brother sitting?";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("Bill 's--nmod_poss-->brother", results.get(0).getEdgeList().get(0).toPrettyString());
    assertEquals("Where--advmod-->is sitting", results.get(0).getEdgeList().get(1).toPrettyString());
    assertEquals("is sitting--nsubj-->brother", results.get(0).getEdgeList().get(2).toPrettyString());
    printResult(results);
  }

  @Test
  void nmodpossAndAdvmod2() {
    String text = "The white unicorn flew.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("The--det-->unicorn", results.get(0).getEdgeList().get(0).toPrettyString());
    assertEquals("white--amod-->unicorn", results.get(0).getEdgeList().get(1).toPrettyString());
    assertEquals("flew--nsubj-->unicorn", results.get(0).getEdgeList().get(2).toPrettyString());

    printResult(results);

    String result = "[{\"id\":0,\"text\":\"unicorn\"},{\"id\":1,\"text\":\"flew.\",\"separator\":true,\"parentId\":0,\"relation\":\"nsubj\"},{\"id\":2,\"text\":\"The\",\"direction\":\"right-down\",\"parentId\":0,\"relation\":\"mod\",\"childrenIndex\":1},{\"id\":3,\"text\":\"white\",\"direction\":\"right-down\",\"parentId\":0,\"relation\":\"mod\",\"childrenIndex\":2}]";
    System.out.println(result);
  }

  private void printResult(List<ParsedResult> results) {
    results.stream().map(r -> new VResult(r)).map(vr -> vr.toJSON()).forEach(System.out::println);
  }
}
