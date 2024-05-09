<?php
class DB {
    private static $instancia = NULL;

    public static function crearInstancia() {
        if (!isset(self::$instancia)) {
            $PDOOptions[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
            self::$instancia = new PDO('mysql:host=localhost;dbname=aipro','root','', $PDOOptions);
        }

        return self::$instancia;
    }
}
?> 