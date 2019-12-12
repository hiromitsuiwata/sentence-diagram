package hiromitsu.sentence;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Constituency
 */
@AllArgsConstructor
@Data
public class Con {

  private int start;
  private int end;
  private String label;
}
