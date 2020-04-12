package hiromitsu.sentence.visualization;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ViewNode {

  private int id = 0;
  private String text;
  private String relation;
  private String direction;
  private int parentId;
  private int childId;
  private boolean separator = false;
}
