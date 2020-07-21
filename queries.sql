--
-- Get a list of all categories
--
SELECT
  categories.category_id,
  categories.category_title
FROM categories;

--
-- Get a list of categories that have articles
--
SELECT
  categories.category_id,
  categories.category_title
FROM categories
WHERE categories.category_id IN (
    SELECT
			articles_categories.category_id
		FROM articles_categories
    );

--
-- Get a list of categories with the number of articles
--
SELECT
	categories.category_id,
	categories.category_title,
	COUNT(*) AS articles_amount
FROM articles_categories
LEFT JOIN categories USING(category_id)
GROUP BY categories.category_id;

--
-- Get a list of articles
--
SELECT
  articles.article_id,
  articles.article_title,
  articles.announce,
  articles.created_date,
    (SELECT concat(readers.first_name, ' ', readers.last_name) FROM readers
    WHERE readers.reader_id = 1) AS author,
    (SELECT readers.email FROM readers
    WHERE readers.reader_id = 1),
    (SELECT COUNT(*)
    FROM comments
    WHERE comments.article_id = articles.article_id) AS comments_amount,
  string_agg(categories.category_title, ', ') AS categories
  FROM articles_categories
  LEFT JOIN articles USING(article_id)
  LEFT JOIN categories USING(category_id)
  GROUP BY articles.article_id
  ORDER BY articles.created_date DESC;

--
-- Get full details of a specific article
--
SELECT
	articles.article_id,
	articles.article_title,
	articles.announce,
	articles.full_text,
	articles.created_date,
	articles.picture_name,
		(SELECT concat(readers.first_name, ' ', readers.last_name)
		 FROM readers WHERE readers.reader_id = 1) AS author,
		(SELECT readers.email
		 FROM readers WHERE readers.reader_id = 1),
		(SELECT COUNT(*)
		 FROM comments WHERE comments.article_id = articles.article_id) AS comments_amount,
	string_agg(categories.category_title, ', ')	AS categories
	FROM articles_categories
	LEFT JOIN articles USING(article_id)
	LEFT JOIN categories USING(category_id)
	WHERE articles.article_id = 1
	GROUP BY articles.article_id;

--
-- Get a list of five last comments
--
SELECT
	comments.comment_id,
	comments.article_id,
	concat(readers.first_name, ' ', readers.last_name) AS reader,
	comments.comment_text
FROM comments
INNER JOIN readers USING(reader_id)
ORDER BY comments.created_date DESC
LIMIT 5;

--
-- Get a list of comments for a specific article
--
SELECT
	comments.comment_id,
	comments.article_id,
	concat(readers.first_name, ' ', readers.last_name) AS reader,
	comments.comment_text
FROM comments
INNER JOIN readers USING(reader_id)
WHERE comments.article_id = 2
ORDER BY comments.created_date DESC;

--
-- Change a title of a specific article
--
UPDATE articles
  SET article_title = 'Как я встретил Новый год'
WHERE article_id = 2;
