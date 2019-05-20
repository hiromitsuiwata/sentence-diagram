package hiromitsu.sentence;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * 文のなかの単語をグルーピングする
 */
public class GroupingNsubjAndNsubjpass {

  private GroupingNsubjAndNsubjpass() {
  }

  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      // 主語のnodeと主語と動詞の間のedgeを作る
      if (dep.getRelation().equals(EdgeType.nsubj.toString())
          || dep.getRelation().equals(EdgeType.nsubjpass.toString())) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        Node node = searchWordInNodes(input, fromWord);
        Node fromNode = null;
        if (node != null) {
          fromNode = node;
        } else {
          fromNode = new Node();
          fromNode.getWordList().add(fromWord);
        }

        Node toNode = new Node();
        toNode.getWordList().add(toWord);
        input.getNodeList().add(toNode);

        Edge edge = new Edge();
        edge.setFrom(fromNode);
        edge.setTo(toNode);
        edge.setType(EdgeType.nsubj);
        input.getEdgeList().add(edge);

        break;
      }
    }
  }

  private static Node searchWordInNodes(ParsedResult input, Word fromWord) {
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
