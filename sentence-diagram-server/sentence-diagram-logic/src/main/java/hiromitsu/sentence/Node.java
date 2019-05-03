package hiromitsu.sentence;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * 文中の句または節.グラフにおける頂点.
 */
@Data
public class Node {
  private List<Word> wordList = new ArrayList<>();
}
