package hiromitsu.sentence.rule;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class Case {

  private Case() {
  }

  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();
    while (ite.hasNext()) {
      Dep dep = ite.next();

      // 格
      if (dep.getRelation().equals("case")) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);
        
        // 一つのノードにまとめる
        List<Node> nodeList = input.getNodeList();
        Node node = new Node();
        node.getWordList().add(fromWord);
        node.getWordList().add(toWord);
        nodeList.add(node);
      }
    }
  }
}
