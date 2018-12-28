package hiromitsu.sentence;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

public class CoreNLPWrapperTest {

  @Test
  void test() {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    String text = "Word formation is sometimes contrasted with semantic change, which is a change in a single word's meaning.";
    List<ParsedResult> results = wrapper.parse(text);

    List<String> jsons = results.stream().map(r -> r.toJSON()).collect(Collectors.toList());
    System.out.println(jsons);
  }
}
