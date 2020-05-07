package hiromitsu.sentence.visualization;

import com.google.gson.annotations.Expose;

import hiromitsu.sentence.Node;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ViewNode {

  // nullオブジェクトはGsonによるJSON変換時に無視される
  // https://github.com/google/gson/blob/master/UserGuide.md#TOC-Null-Object-Support
  @Expose
  private final Integer id;
  @Expose
  private final String text;
  @Expose
  private String relation = null;
  @Expose
  private String direction = null;
  @Expose
  private Integer parentId = null;
  @Expose
  private Integer childOrder = null;
  @Expose
  private Boolean separator = null;

  private Node node;
}
