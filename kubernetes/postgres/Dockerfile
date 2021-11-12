FROM postgres:12.3

# ロケール追加
#RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8
#ENV LANG ja_JP.UTF-8

# タイムゾーン変更
ENV TZ Asia/Tokyo

# 初期セットアップ用のSQLがあれば追加
#COPY *.sql /docker-entrypoint-initdb.d/
