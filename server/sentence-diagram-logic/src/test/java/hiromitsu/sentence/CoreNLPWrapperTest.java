package hiromitsu.sentence;

import java.util.List;

import org.junit.jupiter.api.Test;

public class CoreNLPWrapperTest {

  @Test
  void CoreNLPを呼び出せること() {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    String text = "Bill is calling.";
    List<ParsedResult> results = wrapper.parse(text);
    results.forEach(r -> System.out.println(r.toPrettyJSON()));
    results.forEach(r -> System.out.println(r.toWordTable()));
  }
}
