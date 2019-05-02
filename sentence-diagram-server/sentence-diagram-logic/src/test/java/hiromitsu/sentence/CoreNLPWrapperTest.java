package hiromitsu.sentence;

import java.util.List;

import org.junit.jupiter.api.Test;

public class CoreNLPWrapperTest {

  @Test
  void test() {
    CoreNLPWrapper wrapper = CoreNLPWrapper.getInstance();
    String text = "My wife hates my leaving dirty dishes in the sink.";
    List<ParsedResult> results = wrapper.parse(text);
    results.forEach(r -> System.out.println(r.toPrettyJSON()));
    results.forEach(r -> System.out.println(r.toWordTable()));
    
  }
}
