package hiromitsu.sentence.rule;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import hiromitsu.sentence.Dep;
import hiromitsu.sentence.EdgeType;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.Word;

/**
 * 文のなかの単語をグルーピングする
 */
public class AuxAndAuxpass {

  private AuxAndAuxpass() {
  }

  /**
   * グルーピングを行う.マルチパスで少しずつ変形させる.
   * 
   * @param input
   */
  public static void execute(ParsedResult input) {

    Set<Dep> deps = input.getDependencies();
    Iterator<Dep> ite = deps.iterator();

    Map<Word, List<Word>> wordMap = createAuxMap(input, ite);

    setNode(input, wordMap);
  }

  private static Map<Word, List<Word>> createAuxMap(ParsedResult input, Iterator<Dep> ite) {
    Map<Word, List<Word>> wordMap = new HashMap<>();

    while (ite.hasNext()) {
      Dep dep = ite.next();

      // 助動詞と動詞をグルーピングする
      if (dep.getRelation().equals(EdgeType.aux.toString()) || dep.getRelation().equals(EdgeType.auxpass.toString())) {
        int from = dep.getFrom();
        int to = dep.getTo();
        Word fromWord = input.getWordList().get(from - 1);
        Word toWord = input.getWordList().get(to - 1);

        List<Word> toWords = null;
        if (wordMap.containsKey(fromWord)) {
          toWords = wordMap.get(fromWord);
        } else {
          toWords = new ArrayList<>();
          wordMap.put(fromWord, toWords);
        }
        toWords.add(toWord);
      }
    }
    return wordMap;
  }

  private static void setNode(ParsedResult input, Map<Word, List<Word>> wordMap) {
    Node node = new Node();
    List<Word> wordList = node.getWordList();

    Iterator<Word> ite2 = wordMap.keySet().iterator();
    while (ite2.hasNext()) {
      Word key = ite2.next();
      List<Word> value = wordMap.get(key);
      wordList.add(key);
      wordList.addAll(value);
    }

    wordList.sort(Comparator.comparing(Word::getIndex));
    if (node.getWordList().size() > 0) {
      input.getNodeList().add(node);
    }
  }
}
