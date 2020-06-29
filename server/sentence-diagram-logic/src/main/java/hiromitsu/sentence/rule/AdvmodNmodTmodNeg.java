package hiromitsu.sentence.rule;

import java.util.Iterator;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.Edge;
import hiromitsu.sentence.EdgeType;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class AdvmodNmodTmodNeg {

  private AdvmodNmodTmodNeg() {
  }

  public static void execute(ParsedResult input) {

    Iterator<Dep> ite = input.getDependencies().iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      if (dep.getRelation().equals("advmod") || dep.getRelation().equals("nmod:tmod")
          || dep.getRelation().equals("neg")) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        Node fromNode = Utility.createNodeIfAbsent(input, fromWord);
        Node toNode = new Node();
        toNode.getWordList().add(toWord);
        input.getNodeList().add(toNode);

        Edge edge = new Edge();
        // 逆向きに設定する
        edge.setFrom(toNode);
        edge.setTo(fromNode);

        if (dep.getRelation().equals("advmod")) {
          edge.setType(EdgeType.advmod);
        } else if (dep.getRelation().equals("nmod:tmod")) {
          edge.setType(EdgeType.nmod_tmod);
        } else if (dep.getRelation().equals("neg")) {
          edge.setType(EdgeType.neg);
        }

        input.getEdgeList().add(edge);

        // break;
      }
    }
  }
}
