package hiromitsu.sentence.rule;

import java.util.Iterator;
import java.util.List;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.Edge;
import hiromitsu.sentence.EdgeType;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class DetAndAmod {
  private DetAndAmod() {

  }

  public static void execute(ParsedResult input) {
    Iterator<Dep> ite = input.getDependencies().iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      createEdge(input, dep, EdgeType.det);
      createEdge(input, dep, EdgeType.amod);
    }
  }

  private static void createEdge(ParsedResult input, Dep dep, EdgeType edgeType) {
    if (dep.getRelation().equals(edgeType.toString())) {

      int from = dep.getFrom();
      int to = dep.getTo();
      Word fromWord = input.getWordList().get(from - 1);
      Word toWord = input.getWordList().get(to - 1);

      // fromNodeは既に存在している可能性があるので、まだない場合のみ作ってnodeListに追加する
      Node fromNode = Utility.createNodeIfAbsent(input, fromWord);
      List<Node> nodeList = input.getNodeList();
      if (!nodeList.contains(fromNode)) {
        nodeList.add(fromNode);
      }

      Node toNode = new Node();
      toNode.getWordList().add(toWord);
      nodeList.add(toNode);

      Edge edge = new Edge();
      // 逆向きに設定する
      edge.setFrom(toNode);
      edge.setTo(fromNode);
      edge.setType(edgeType);
      input.getEdgeList().add(edge);
    }
  }
}
