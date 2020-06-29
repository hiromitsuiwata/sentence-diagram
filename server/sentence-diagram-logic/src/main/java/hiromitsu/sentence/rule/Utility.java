package hiromitsu.sentence.rule;

import java.util.List;

import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * ユーティリティー
 */
class Utility {
  
  private Utility() {
    
  }

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
  
  static Node createNodeIfAbsent(ParsedResult input, Word word) {
    Node result = null;
    
    Node node = searchWordInNodes(input, word);
    if (node != null) {
      result = node;
    } else {
      result = new Node();
      result.getWordList().add(word);
    }
    
    return result;
  }
}
