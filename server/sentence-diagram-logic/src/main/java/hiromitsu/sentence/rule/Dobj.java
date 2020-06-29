package hiromitsu.sentence.rule;

import java.util.Iterator;
import java.util.List;
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
public class Dobj {

  private Dobj() {
  }

  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      if (dep.getRelation().equals(EdgeType.dobj.toString())) {
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
        edge.setFrom(toNode);
        edge.setTo(fromNode);
        edge.setType(EdgeType.dobj);
        input.getEdgeList().add(edge);

        break;
      }
    }
  }
}
