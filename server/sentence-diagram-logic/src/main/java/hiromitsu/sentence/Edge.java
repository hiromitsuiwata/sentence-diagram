package hiromitsu.sentence;

import lombok.Data;

/**
 * 文中の関連.グラフにおけるノード間の枝
 */
@Data
public class Edge {
  private Node from;
  private Node to;
  private String type;

  public String toPrettyString() {
    StringBuilder sb = new StringBuilder();
    String fromString = from.toPrettyString();
    String toString = to.toPrettyString();
    sb.append(fromString).append("--").append(type).append("-->").append(toString);
    return sb.toString();
  }
}
