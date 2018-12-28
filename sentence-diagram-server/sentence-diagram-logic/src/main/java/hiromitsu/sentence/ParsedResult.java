package hiromitsu.sentence;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

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

  private ObjectMapper mapper;

  public ParsedResult() {
    mapper = new ObjectMapper();
    mapper.enable(SerializationFeature.INDENT_OUTPUT);
  }

  /**
   * JSON文字列を取得するテスト用メソッド. サーバーからAPIとして公開する場合はJSON-Bを利用.
   * 
   * @return JSON文字列
   */
  public final String toJSON() {
    try {
      return mapper.writeValueAsString(this);
    } catch (JsonProcessingException e) {
      // TODO エラーハンドリング方針をどうするか？
      throw new IllegalArgumentException(e);
    }
  }
}
