package hiromitsu.sentence;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;

import hiromitsu.sentence.visualization.ViewMapper;
import hiromitsu.sentence.visualization.ViewNode;

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
    List<Edge> edgeList = results.get(0).getEdgeList();
    assertEquals("Bill 's--nmod_poss-->brother", edgeList.get(0).toPrettyString());
    assertEquals("Where--advmod-->is", edgeList.get(1).toPrettyString());
    assertEquals("is--nsubj-->brother", edgeList.get(2).toPrettyString());
    printResult(results);
  }

  @Test
  void nmodpossAndAdvmod2() {
    String text = "The white unicorn flew.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("The--det-->unicorn", results.get(0).getEdgeList().get(0).toPrettyString());
    assertEquals("white--amod-->unicorn", results.get(0).getEdgeList().get(1).toPrettyString());
    assertEquals("flew--nsubj-->unicorn", results.get(0).getEdgeList().get(2).toPrettyString());

    // printResult(results);

    List<ViewNode> actualVNs = ViewMapper.map(results.get(0));

    System.out.println("目標");
    String expected = "[{\"id\":0,\"text\":\"unicorn\"},{\"id\":1,\"text\":\"flew.\",\"separator\":true,\"parentId\":0,\"relation\":\"nsubj\"},{\"id\":2,\"text\":\"The\",\"direction\":\"right-down\",\"parentId\":0,\"relation\":\"mod\",\"childId\":1},{\"id\":3,\"text\":\"white\",\"direction\":\"right-down\",\"parentId\":0,\"relation\":\"mod\",\"childId\":2}]";
    String prettyPrintedJson = new GsonBuilder().setPrettyPrinting().create().toJson(JsonParser.parseString(expected));
    System.out.println(prettyPrintedJson);
  }

  @Test
  void negNmodTmod() {
    String text = "I will not drive tomorrow.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("not--advmod-->will drive", results.get(0).getEdgeList().get(0).toPrettyString());
    assertEquals("will drive--nsubj-->I", results.get(0).getEdgeList().get(1).toPrettyString());
  }

  @Test
  void dobj() {
    String text = "Roger sent a package.";
    List<ParsedResult> results = Analyzer.analyze(text);
    assertEquals("a--det-->package", results.get(0).getEdgeList().get(0).toPrettyString());
    assertEquals("sent--nsubj-->Roger", results.get(0).getEdgeList().get(1).toPrettyString());
  }

  private void printResult(List<ParsedResult> results) {
    results.stream().map(r -> new ViewMapper(r)).map(vr -> vr.toJSON()).forEach(System.out::println);
  }
}
