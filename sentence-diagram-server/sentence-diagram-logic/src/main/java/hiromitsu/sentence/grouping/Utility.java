package hiromitsu.sentence.grouping;

import java.util.List;

import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

class Utility {

  static Node searchWordInNodes(ParsedResult input, Word fromWord) {
    // fromの方は句になっている場合があるので、Nodeの中から探す
    List<Node> nodes = input.getNodeList();
    for (Node node : nodes) {
      if (node.getWordList().contains(fromWord)) {
        return node;
      }
    }
    return null;
  }
}
