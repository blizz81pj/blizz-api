create table beer_recipe_note
(
    beer_recipe_note_id int unsigned auto_increment
        primary key,
    beer_recipe_id      int unsigned                       not null,
    note                varchar(500)                       not null,
    row_created         datetime default CURRENT_TIMESTAMP null,
    row_modified        datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id)
);