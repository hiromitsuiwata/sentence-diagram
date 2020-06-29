package hiromitsu.sentence.rule;

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
public class NmodPoss {

  private NmodPoss() {
  }

  /**
   * nmod:poss, nmod:tmodのEdge設定を行う
   * 
   * @param input
   */
  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();

    while (ite.hasNext()) {
      Dep dep = ite.next();

      if (dep.getRelation().equals("nmod:poss")) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        Node fromNode = Utility.searchWordInNodes(input, toWord);
        Node toNode = new Node();
        toNode.getWordList().add(fromWord);
        input.getNodeList().add(toNode);

        Edge edge = new Edge();
        // 逆向きに設定する
        edge.setFrom(fromNode);
        edge.setTo(toNode);
        if (dep.getRelation().equals("nmod:poss")) {
          edge.setType(EdgeType.nmod_poss);
        }
        input.getEdgeList().add(edge);
      }
    }
  }
}
