package hiromitsu.sentence;

import java.util.List;
import java.util.Set;

import com.google.gson.Gson;

import lombok.Getter;
import lombok.Setter;

/**
 * CoreNLPパーサーの実行結果を格納しJSON形式で取り出す
 */
public class ParsedResult {
  @Setter
  @Getter
  private String originalSentence;
  @Setter
  @Getter
  private List<String> tokens;
  @Setter
  @Getter
  private List<String> lemmas;
  @Setter
  @Getter
  private List<String> posTags;
  @Setter
  @Getter
  private Set<String> constituents;
  @Setter
  @Getter
  private String constituentyText;
  @Setter
  @Getter
  private Set<Dep> dependencies;

  public ParsedResult() {
  }

  /**
   * JSON文字列を取得するテスト用メソッド.
   * @return JSON文字列
   */
  public final String toJSON() {
    Gson gson = new Gson();
    return gson.toJson(this);
  }
}
