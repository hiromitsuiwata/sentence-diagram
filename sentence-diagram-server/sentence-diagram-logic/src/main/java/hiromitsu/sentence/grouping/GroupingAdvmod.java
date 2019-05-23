package hiromitsu.sentence.grouping;

import java.util.Iterator;
import java.util.Set;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.Edge;
import hiromitsu.sentence.EdgeType;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class GroupingAdvmod {

  private GroupingAdvmod() {
  }

  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      if (dep.getRelation().equals(EdgeType.advmod.toString())) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        Node node = Utility.searchWordInNodes(input, fromWord);
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
        // 逆向きに設定する
        edge.setFrom(toNode);
        edge.setTo(fromNode);
        edge.setType(EdgeType.advmod);
        input.getEdgeList().add(edge);

        break;
      }
    }
  }
}
