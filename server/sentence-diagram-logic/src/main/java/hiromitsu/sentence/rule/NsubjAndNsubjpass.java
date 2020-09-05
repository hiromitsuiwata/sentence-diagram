package hiromitsu.sentence.rule;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.Edge;
import hiromitsu.sentence.EdgeTypeString;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class NsubjAndNsubjpass {

  private NsubjAndNsubjpass() {
  }

  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      // 主語のnodeと主語と動詞の間のedgeを作る
      if (dep.getRelation().equals(EdgeTypeString.NSUBJ) || dep.getRelation().equals(EdgeTypeString.NSUBJPASS)) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        List<Node> nodeList = input.getNodeList();

        Node fromNode = Utility.createNodeIfAbsent(input, fromWord);
        if (!nodeList.contains(fromNode)) {
          nodeList.add(fromNode);
        }

        Node toNode = new Node();
        toNode.getWordList().add(toWord);
        if (!nodeList.contains(toNode)) {
          nodeList.add(toNode);
        }

        Edge edge = new Edge();
        edge.setFrom(fromNode);
        edge.setTo(toNode);
        edge.setType(EdgeTypeString.NSUBJ);
        input.getEdgeList().add(edge);

        break;
      }
    }
  }
}
