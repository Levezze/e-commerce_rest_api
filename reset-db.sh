#!/bin/bash

set -e

DB_NAME="levl_store"
DB_USER="levezze"
SCHEMA_FILE="db/schema.pgsql"

echo "⚠️ This will drop and recreate the '$DB_NAME' database."
read -p "Are you sure? (y/N): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "❌ Aborted."
  exit 1
fi

echo "Dropping and recreating database '$DB_NAME'..."

psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "Applying schema from $SCHEMA_FILE..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE"

echo "Database '$DB_NAME' has been reset successfully."

exit 0