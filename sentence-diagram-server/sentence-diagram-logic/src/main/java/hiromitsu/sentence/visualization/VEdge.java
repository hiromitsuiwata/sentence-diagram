package hiromitsu.sentence.visualization;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 表示用のエッジ
 */
@Data
@AllArgsConstructor
public class VEdge {

  private String fromIds;
  private String toIds;
  private String type;

}
