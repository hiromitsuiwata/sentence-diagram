package hiromitsu.sentence;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;

public class CoreNLPWrapperTest {

  @Test
  void CoreNLPを呼び出せること() {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    String text = "Bill is calling.";
    List<ParsedResult> results = wrapper.parse(text);
    assertNotNull(results);
    results.forEach(r -> System.out.println(r.toPrettyJSON()));
    results.forEach(r -> System.out.println(r.toWordTable()));
  }
}
