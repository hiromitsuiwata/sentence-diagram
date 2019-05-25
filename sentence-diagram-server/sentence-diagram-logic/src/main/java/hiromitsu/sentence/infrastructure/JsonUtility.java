package hiromitsu.sentence.infrastructure;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

/**
 * Json関連のユーティリティー
 */
public class JsonUtility {

  private JsonUtility() {
  }

  /**
   * 整形して返す
   * 
   * @param json
   * @return 整形後のJSON文字列
   */
  public static String toPrettyJSON(String json) {
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    JsonParser jp = new JsonParser();
    JsonElement je = jp.parse(json);
    String prettyJsonString = gson.toJson(je);
    return prettyJsonString;
  }
}
