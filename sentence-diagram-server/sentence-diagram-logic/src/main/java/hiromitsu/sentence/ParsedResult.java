package hiromitsu.sentence;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * CoreNLPパーサーの実行結果を格納しJSON形式で取り出す
 */
@ToString
@Setter
@Getter
public class ParsedResult {
  private String originalSentence;
  private String constituentyText;
  private Set<Con> constituents;
  private Set<Dep> dependencies;
  private List<Word> wordList;
  private List<Node> nodeList = new ArrayList<>();
  private List<Edge> edgeList = new ArrayList<>();

  /**
   * JSON文字列を取得する
   * 
   * @return JSON文字列
   */
  public String toJSON() {
    Gson gson = new Gson();
    return gson.toJson(this);
  }

  /**
   * 整形されたJSON文字列を取得する
   * 
   * @return JSON文字列
   */
  public String toPrettyJSON() {
    String json = this.toJSON();
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    JsonParser jp = new JsonParser();
    JsonElement je = jp.parse(json);
    String prettyJsonString = gson.toJson(je);
    return prettyJsonString;
  }

  /**
   * 品詞を表形式の文字列に整形する
   * @return 単語と品詞の表
   */
  public String toWordTable() {
    StringBuffer sbIndex = new StringBuffer();
    StringBuffer sbToken = new StringBuffer();
    StringBuffer sbLemma = new StringBuffer();
    StringBuffer sbPosTag = new StringBuffer();

    for (int i = 0; i < wordList.size(); i++) {
      Word w = wordList.get(i);
      String format;
      if (i > 9 && w.getMaxLength() == 1) {
        // indexが2桁かつ最大文字列長が1桁の場合、書式を1桁伸ばす
        format = "%-" + (w.getMaxLength() + 2) + "s";
      } else {
        format = "%-" + (w.getMaxLength() + 1) + "s";
      }
      sbIndex.append(String.format(format, i + 1));
      sbToken.append(String.format(format, w.getToken()));
      sbLemma.append(String.format(format, w.getLemma()));
      sbPosTag.append(String.format(format, w.getPosTag()));
    }
    
    StringBuffer sb = new StringBuffer();
    sb.append(sbIndex).append("\n").append(sbToken).append("\n").append(sbLemma).append("\n").append(sbPosTag);
    return sb.toString();
  }
  
  public String toGraphEdges() {
    StringBuffer sb = new StringBuffer();
    for (Edge edge : edgeList) {
      List<Word> fromWords = edge.getFrom().getWordList();
      List<Word> toWords = edge.getTo().getWordList();
      sb.append(fromWords.toString()).append(" --> ").append(toWords.toString());
    }
    return sb.toString();
  }
}
