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

        Node fromNode = Utility.createNodeIfAbsent(input, fromWord);

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
}
